<script lang="ts">
  import { getContext } from "svelte"
  import type { Writable } from "svelte/store"
  import SettingsModule from "./settings_module.svelte"
  import PricingModule from "../../../(marketing)/pricing/pricing_module.svelte"
  import {
    pricingPlans,
    defaultPlanId,
  } from "../../../(marketing)/pricing/pricing_plans"
  let adminSection: Writable<string> = getContext("adminSection")
  adminSection.set("home")
  export let data
  let currentPlanId = data.currentPlanId ?? defaultPlanId
  let currentPlanName = pricingPlans.find(
    (x) => x.id === data.currentPlanId,
  )?.name
  let { profile, user } = data
</script>

<svelte:head>
  <title>Account</title>
</svelte:head>
<h1 class="text-2xl font-bold mb-6">Account</h1>
<h2 class="text-xl font-bold mb-2">
  {data.isActiveCustomer ? "Billing" : "Select a Plan"}
</h2>
<div>
  View our <a href="/pricing" target="blank" class="link">pricing page</a> for details.
</div>
{#if !data.isActiveCustomer}
  <div class="mt-8">
    <PricingModule {currentPlanId} callToAction="Select Plan" center={false} />
  </div>
  {#if data.hasEverHadSubscription}
    <div class="mt-10">
      <a href="/account/manage-billing" class="link">View past invoices</a>
    </div>
  {/if}
{:else}
  <SettingsModule
    title="Subscription"
    editable={false}
    fields={[
      {
        id: "plan",
        label: "Current Plan",
        initialValue: currentPlanName || "",
      },
    ]}
    editButtonTitle="Manage Subscription"
    editLink="/account/manage-billing"
  />
{/if}
<h2 class="text-xl font-bold mb-6 mt-12">Settings</h2>
<SettingsModule
  title="Profile"
  editable={false}
  fields={[
    { id: "fullName", label: "Name", initialValue: profile?.full_name ?? "" },
    {
      id: "email",
      label: "Email",
      initialValue: user?.email || "",
    },
  ]}
/>
<SettingsModule
  title="Danger Zone"
  editable={false}
  dangerous={true}
  fields={[]}
  editButtonTitle="Delete Account"
  editLink="/account/delete_account"
/>
