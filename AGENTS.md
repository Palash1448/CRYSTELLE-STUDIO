<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Storefront architecture
- Shared storefront chrome and session shopping state live in a browser-safe React provider around the root outlet, so all pages share one cart without requiring commerce services.
- Product and editorial sample content live in a shared data module; leaf routes own unique page metadata.
- Storefront visual roles and layouts are defined in the global design system, keeping the reference design consistent across pages.
