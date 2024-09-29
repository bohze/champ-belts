import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  // Check if the user is authenticated
  const user = await serverSupabaseUser(event)

  if (!user) {
    // If the user is not authenticated, return an error
    // throw createError({
    //   statusCode: 401,
    //   message: 'Unauthorized: You must be logged in to access this resource',
    // })
    return { message: '111' }
  }

  // If the user is authenticated, proceed with your API logic
  // ... your API logic here ...

  return {
    message: 'Authenticated user accessed this API',
    user,
  }
})
