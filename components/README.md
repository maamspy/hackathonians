Structured UI building blocks for the whole project. Every file in this directory belongs to a registry. Import and export through the registry's single index only, never reach into individual files.

```js
// do
import { Button, Logo } from "@/components/custom";
import { Navbar } from "@/components/shared";
import { Switch } from "@/components/ui";

// do not
import Button from "@/components/custom/button";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
```

- Add new components to their registry's `index.js` on creation.
- Move a component? Re-export it from its new registry's index.
