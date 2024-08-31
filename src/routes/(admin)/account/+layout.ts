import {
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from "$env/static/public"
import {
  createBrowserClient,
  createServerClient,
  isBrowser,
} from "@supabase/ssr"
import { redirect } from "@sveltejs/kit"
import type { Database } from "../../../DatabaseDefinitions.js"

export const load = async ({ fetch, data, depends, url }) => {
  depends("supabase:auth")

  const supabase = isBrowser()
    ? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: {
          fetch,
        },
      })
    : createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: {
          fetch,
        },
        cookies: {
          getAll() {
            return data.cookies
          },
        },
      })

  /**
   * Not always safe on server, but calling getUser next to verify JWT token
   */
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // https://github.com/supabase/auth-js/issues/888#issuecomment-2189298518
  if ("suppressGetSessionWarning" in supabase.auth) {
    // @ts-expect-error - suppressGetSessionWarning is not part of the official API
    supabase.auth.suppressGetSessionWarning = true
  } else {
    console.warn(
      "SupabaseAuthClient#suppressGetSessionWarning was removed. See https://github.com/supabase/auth-js/issues/888.",
    )
  }
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    // JWT validation has failed
    console.log("User error", userError)
    redirect(303, "/login")
  }

  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

  const profile: Database["public"]["Tables"]["profiles"]["Row"] | null =
    data.profile

//     const { data: stripeCustomer, error: stripeError } = await supabase
//     .from('stripe_customers')
//     .select('stripe_customer_id')
//     .eq('user_id', user.id)
//     .single()

//     console.log("Stripe query result:", { stripeCustomer, stripeError, userId: user.id })

//   const signOutPath = "/account/sign_out"
//   const SelectPlanPath = "/account/select_plan"

//   if (!stripeCustomer?.stripe_customer_id && 
//     url.pathname !== SelectPlanPath &&
//     url.pathname !== signOutPath) {
//   redirect(303, SelectPlanPath)
// }

  return {
    supabase,
    session,
    profile,
    user,
    amr: aal?.currentAuthenticationMethods,
  }
}
