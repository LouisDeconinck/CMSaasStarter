<script lang="ts">
  import { Auth } from "@supabase/auth-ui-svelte"
  import { oauthProviders, sharedAppearance } from "./login_config"
  import { page } from "$app/stores"
</script>

<svelte:head>
  <title>Log In</title>
</svelte:head>

<div>
  <h1 class="text-xl font-bold mb-6">Login</h1>
  <Auth
    supabaseClient={$page.data.supabase}
    view="sign_in"
    appearance={sharedAppearance}
    providers={oauthProviders}
    redirectTo={`${$page.data.url}/auth/callback`}
    onlyThirdPartyProviders={true}
  />
</div>
