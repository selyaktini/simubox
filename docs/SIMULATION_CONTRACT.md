# Simulation contract v1

A YAML manifest is the single source of truth for identity and provenance. `id` is a stable lowercase slug. Required fields: `title`, `summary`, allowed `category`, `tags`, `authors`, HTTPS `sourceUrl`, allowed SPDX `license` identifier or `Pending`, `status`, `origin`, `capabilities`, a preview object with `image`, `alt`, `caption` and short `label`, and `content` pointing to a Markdown scientific note. First-party playable entries additionally need a root-relative safe `.html` `entryPoint`. External candidates require a full 40-character source commit SHA and cannot provide an entry point. External `verified` status is reserved; validation currently rejects it until artifact and hosting review exist.

Markdown provides experiment instructions, scientific model, assumptions, limitations and references. It must not duplicate manifest identity fields. Manifests reject unknown fields, including build commands. Adding a valid first-party entry and notes causes catalogue and detail generation without editing UI cards.

Future external integration must pin an immutable source revision, verify licenses and dependency notices, build without secrets, inspect output and browser behavior, and publish to a separate origin. Static browser compatibility is a requirement; the implementation technology is unrestricted.
