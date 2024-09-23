<script setup lang="ts">
const user = useSupabaseUser()
const { auth } = useSupabaseClient()
const router = useRouter()

const logout = async () => {
  try {
    const { error } = await auth.signOut()
    if (error) {
      console.log(error)

      throw new Error(error.message)
    }

    router.push('/auth/login')
  }
  catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div>
    <Button @click="logout">
      Logout
    </Button>
    <pre>{{ user }}</pre>
  </div>
</template>
