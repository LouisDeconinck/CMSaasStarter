import { fail, redirect } from "@sveltejs/kit"

export const actions = {
  deleteAccount: async ({
    locals: { supabase, supabaseServiceRole, safeGetSession },
  }) => {
    const { session, user } = await safeGetSession()
    if (!session || !user?.id) {
      redirect(303, "/login")
    }

    const { error } = await supabaseServiceRole.auth.admin.deleteUser(
      user.id,
      true,
    )
    if (error) {
      return fail(500, {
        errorMessage: "Unknown error. If this persists please contact us."
      })
    }

    await supabase.auth.signOut()
    redirect(303, "/")
  },
  updateProfile: async ({ request, locals: { supabase, safeGetSession } }) => {
    const { session, user } = await safeGetSession()
    if (!session || !user?.id) {
      redirect(303, "/login")
    }

    const formData = await request.formData()
    const fullName = formData.get("fullName") as string

    let validationError
    const fieldMaxTextLength = 50
    const errorFields = []
    if (!fullName) {
      validationError = "Name is required"
      errorFields.push("fullName")
    } else if (fullName.length > fieldMaxTextLength) {
      validationError = `Name must be less than ${fieldMaxTextLength} characters`
      errorFields.push("fullName")
    }
    if (validationError) {
      return fail(400, {
        errorMessage: validationError,
        errorFields,
        fullName,
      })
    }

    // To check if created or updated
    const { data: priorProfile } = await supabase
      .from("profiles")
      .select(`*`)
      .eq("id", session?.user.id)
      .single()

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: fullName,
        updated_at: new Date(),
        unsubscribed: priorProfile?.unsubscribed ?? false,
      })
      .select()

    if (error) {
      return fail(500, {
        errorMessage: "Unknown error. If this persists please contact us.",
        fullName,
      })
    }

    return {
      fullName,
    }
  },
  signout: async ({ locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession()
    if (session) {
      await supabase.auth.signOut()
      redirect(303, "/")
    } else {
      redirect(303, "/")
    }
  },
}
