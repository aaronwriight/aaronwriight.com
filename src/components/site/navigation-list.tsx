"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type CSSProperties, createContext, useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import type { NavigationItem } from "@/data/navigation";

const OPEN_DELAY = 350;
const CLOSE_DELAY = 300;
const SUBMENU_DURATION = 400;
const POINTER_INTENT_DISTANCE = 4;

type PointerIntentListener = (target: Node | null) => void;
const PointerIntentContext = createContext<Set<PointerIntentListener> | null>(null);

function AnimatedSubmenu({ id, expanded, children }: {
  id: string;
  expanded: boolean;
  children: React.ReactNode;
}) {
  const [retained, setRetained] = useState(false);

  useEffect(() => {
    if (expanded) {
      setRetained(true);
      return;
    }
    // Keep the full contents through the exit, then reset nested branches.
    const timer = setTimeout(() => setRetained(false), SUBMENU_DURATION + 50);
    return () => clearTimeout(timer);
  }, [expanded]);

  return (
    <div id={id} className="navigation-submenu" style={{ "--submenu-duration": `${SUBMENU_DURATION}ms` } as CSSProperties} data-expanded={expanded} aria-hidden={!expanded} inert={!expanded}>
      <div className="navigation-submenu-clip min-h-0 overflow-hidden">
        {/* pt-1 leaves room inside the clip for the first link's focus ring; mb-1 keeps the total spacing the same. */}
        <ul className="mb-1 ml-3 border-l border-stone-200 pl-3 pt-1 dark:border-stone-800">
          {(expanded || retained) && children}
        </ul>
      </div>
    </div>
  );
}

function NavigationBranch({ item, pathname, active = true, order = 0 }: {
  item: NavigationItem;
  pathname: string;
  active?: boolean;
  order?: number;
}) {
  const [mode, setMode] = useState<"closed" | "hover" | "pinned">("closed");
  const expanded = mode !== "closed";
  const submenuId = useId();
  const branch = useRef<HTMLLIElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pinned = useRef(false);
  const hovered = useRef(false);
  const rowHovered = useRef(false);
  const hoverDismissed = useRef(false);
  const hoverExitStarted = useRef(-Infinity);
  const hasChildren = Boolean(item.children?.length);
  const isPdf = item.href.split("?")[0].endsWith(".pdf");
  const pointerListeners = useContext(PointerIntentContext);

  // An exiting ancestor owns the animation; descendants reset after it finishes.
  useEffect(() => {
    if (!active) {
      clearTimeout(openTimer.current);
      openTimer.current = undefined;
      clearTimeout(closeTimer.current);
      hovered.current = false;
      rowHovered.current = false;
    }
  }, [active]);

  useEffect(() => () => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
  }, []);

  function closeBranch() {
    clearTimeout(openTimer.current);
    openTimer.current = undefined;
    clearTimeout(closeTimer.current);
    pinned.current = false;
    hoverDismissed.current = rowHovered.current;
    hoverExitStarted.current = -Infinity;
    setMode("closed");
  }

  const scheduleClose = useCallback(() => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      if (!hovered.current && !pinned.current && !branch.current?.contains(document.activeElement)) {
        hoverExitStarted.current = performance.now();
        setMode("closed");
      }
    }, CLOSE_DELAY);
  }, []);

  useEffect(() => {
    if (!active || !hasChildren || !pointerListeners) return;

    // Only real pointer travel updates these hover snapshots. A submenu moving
    // under or away from the cursor must not cancel a dwell or close a neighbor.
    const onPointerIntent: PointerIntentListener = (target) => {
      const wasHovered = hovered.current;
      hovered.current = Boolean(target && branch.current?.contains(target));
      rowHovered.current = Boolean(target && row.current?.contains(target));

      if (hovered.current) {
        clearTimeout(closeTimer.current);
      } else if (wasHovered && expanded && !pinned.current) {
        scheduleClose();
      }

      if (!rowHovered.current) {
        clearTimeout(openTimer.current);
        openTimer.current = undefined;
        hoverDismissed.current = false;
      } else if (!expanded && !hoverDismissed.current && !openTimer.current) {
        const delay = performance.now() - hoverExitStarted.current < SUBMENU_DURATION ? 0 : OPEN_DELAY;
        openTimer.current = setTimeout(() => {
          openTimer.current = undefined;
          if (rowHovered.current) setMode("hover");
        }, delay);
      }
    };

    pointerListeners.add(onPointerIntent);
    return () => { pointerListeners.delete(onPointerIntent); };
  }, [active, expanded, hasChildren, pointerListeners, scheduleClose]);

  return (
    <li
      ref={branch}
      className="navigation-branch"
      style={{ "--navigation-order": Math.min(order, 6) } as CSSProperties}
      onBlur={(event) => {
        if (active && !hovered.current && !pinned.current && !event.currentTarget.contains(event.relatedTarget)) {
          scheduleClose();
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && expanded) {
          event.stopPropagation();
          closeBranch();
          toggle.current?.focus();
        }
      }}
    >
      <div
        ref={row}
        // Inline flow, so a wrapped label keeps its chevron right after the last word. The label wraps inside a nowrap
        // row, and a word joiner ties the chevron to the label, so the chevron never starts a line on its own.
        className="navigation-row whitespace-nowrap py-0.5 leading-5"
      >
        <Link
          href={item.href}
          aria-current={pathname === item.href ? "page" : undefined}
          target={isPdf ? "_blank" : undefined}
          rel={isPdf ? "noopener noreferrer" : undefined}
          onClick={(event) => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            const [destination, id] = item.href.split("#");
            if (destination === pathname && id) {
              const section = document.getElementById(id);
              // Next's same-page navigation uses history rather than a hashchange event.
              if (section instanceof HTMLDetailsElement) section.open = true;
            }
          }}
          // Vertical padding on the inline link fills the row, so the whole row height can be clicked or tapped.
          className="whitespace-normal py-[0.4em] leading-5"
        >
          {item.label}
        </Link>
        {hasChildren && "\u2060"}
        {hasChildren && (
          <button ref={toggle} type="button" aria-label={mode === "hover" ? `Keep ${item.label} submenu open` : `${expanded ? "Collapse" : "Expand"} ${item.label} submenu`} aria-expanded={expanded} aria-controls={submenuId} onClick={() => {
            clearTimeout(openTimer.current);
            openTimer.current = undefined;
            clearTimeout(closeTimer.current);
            if (pinned.current) closeBranch();
            else {
              pinned.current = true;
              setMode("pinned");
            }
          }} className="my-[calc((1.25rem-24px)/2)] ml-2 inline-flex min-h-[24px] min-w-[24px] cursor-pointer items-center justify-center align-top text-base leading-5 hover:text-olive focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal">
            <span aria-hidden="true" className={`transition-transform duration-400 ease-in-out motion-reduce:transition-none ${expanded ? "rotate-90" : ""}`}>›</span>
          </button>
        )}
      </div>
      {hasChildren && (
        <AnimatedSubmenu id={submenuId} expanded={expanded}>
          {item.children!.map((child, index) => <NavigationBranch key={child.href} item={child} pathname={pathname} active={active && expanded} order={index} />)}
        </AnimatedSubmenu>
      )}
    </li>
  );
}

function NavigationTree({ items, pathname }: { items: NavigationItem[]; pathname: string }) {
  const [pointerListeners] = useState(() => new Set<PointerIntentListener>());

  useEffect(() => {
    let lastPointer: { x: number; y: number } | undefined;

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      // Ignore layout-generated boundary events and tiny cursor jitter. Tracking
      // the whole document also catches deliberate movement out of the menu.
      if (lastPointer && Math.hypot(event.clientX - lastPointer.x, event.clientY - lastPointer.y) < POINTER_INTENT_DISTANCE) return;
      lastPointer = { x: event.clientX, y: event.clientY };
      const target = event.target instanceof Node ? event.target : null;
      pointerListeners.forEach((listener) => listener(target));
    }

    function leaveWindow() {
      lastPointer = undefined;
      pointerListeners.forEach((listener) => listener(null));
    }

    function onPointerOut(event: PointerEvent) {
      if (event.pointerType === "mouse" && event.relatedTarget === null) leaveWindow();
    }

    document.addEventListener("pointermove", onPointerMove, { passive: true, capture: true });
    document.addEventListener("pointerout", onPointerOut);
    window.addEventListener("blur", leaveWindow);
    return () => {
      document.removeEventListener("pointermove", onPointerMove, true);
      document.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("blur", leaveWindow);
    };
  }, [pointerListeners]);

  return (
    <PointerIntentContext.Provider value={pointerListeners}>
      <ul className="site-navigation m-0 list-none p-0 text-xs tracking-wider text-stone-500">
        {items.map((item) => <NavigationBranch key={item.href} item={item} pathname={pathname} />)}
      </ul>
    </PointerIntentContext.Provider>
  );
}

export function NavigationList({ items }: { items: NavigationItem[] }) {
  const pathname = usePathname();
  return <NavigationTree key={pathname} items={items} pathname={pathname} />;
}
