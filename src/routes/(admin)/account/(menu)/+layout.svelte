<script lang="ts">
  import "../../../../app.css"
  import { writable } from "svelte/store"
  import { setContext } from "svelte"
  import { WebsiteName } from "../../../../config"

  const adminSectionStore = writable("")
  setContext("adminSection", adminSectionStore)
  let adminSection: string
  adminSectionStore.subscribe((value) => {
    adminSection = value
  })

  function closeDrawer(): void {
    const adminDrawer = document.getElementById(
      "admin-drawer",
    ) as HTMLInputElement
    adminDrawer.checked = false
  }
</script>

<div class="drawer lg:drawer-open">
  <input id="admin-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">
    <div class="navbar bg-base-100 lg:hidden">
      <div class="flex-1">
        <a class="btn btn-ghost normal-case text-xl" href="/">{WebsiteName}</a>
      </div>
      <div class="flex-none">
        <div class="dropdown dropdown-end">
          <label for="admin-drawer" class="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h7"
              /></svg
            >
          </label>
        </div>
      </div>
    </div>
    <div class="container px-6 lg:px-12 py-3 lg:py-6">
      <slot />
    </div>
  </div>

  <div class="drawer-side">
    <label for="admin-drawer" class="drawer-overlay" />
    <ul
      class="menu menu-lg p-4 w-80 min-h-full bg-base-100 lg:border-r text-primary"
    >
      <li>
        <div
          class="normal-case menu-title text-xl font-bold text-primary flex flex-row"
        >
          <a href="/" class="grow">{WebsiteName}</a>
          <label for="admin-drawer" class="lg:hidden ml-3"> &#x2715; </label>
        </div>
      </li>
      <li>
        <a
          href="/account"
          class={adminSection === "home" ? "active" : ""}
          on:click={closeDrawer}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            /></svg
          >
          Home
        </a>
      </li>

      <li class="mt-auto">
        <a href="/account/sign_out" class="mt-auto text-base">Sign Out</a>
      </li>
    </ul>
  </div>
</div>
