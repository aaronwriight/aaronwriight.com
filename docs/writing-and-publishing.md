# Writing and publishing posts

The canonical author guide is [`writing/README.md`](../writing/README.md).

The current workflow reads explicitly selected SFI/Venture manuscripts from the external personal writing folder. Configure it with `pnpm writing source PATH`; local configuration and the derived `.writing-workspace/` are ignored by Git. Source documents are never modified by the pipeline. `refresh` regenerates review files, and source/cache fingerprints prevent publication from stale or independently edited copies.

Existing metadata can be linked with `pnpm writing adopt ENTRY --source BLOG/FILE` without changing legacy source files. The shared entry sequence still reserves existing legacy and published entries. No real manuscript is automatically selected or adopted.

Publication remains explicit and produces the existing portable `content/` records and public image derivatives. Commit reviewed publication outputs through the normal site workflow. Vercel does not read the external folder or depend on a local symlink. Preview, dry-run, newsletter, unpublish, and erase behavior is documented in the canonical guide; erasure in external mode affects only website outputs and local cache/metadata.

Keep that guide as the single documentation source; older `sfi:*` commands remain legacy compatibility tools and do not implement this external-source handoff.
