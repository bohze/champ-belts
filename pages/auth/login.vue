<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import { Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

definePageMeta({
  layout: 'auth',
})

const { auth } = useSupabaseClient()
const router = useRouter()
const user = useSupabaseUser()

onMounted(() => {
  if (user.value) {
    router.push('/')
  }
})

const errorMessage = ref('')
const inProgress = ref(false)

const validationSchema = toTypedSchema(
  yup.object({
    email: yup.string().required().email(),
    password: yup.string().required(),
  }),
)

const { errors, defineField, handleSubmit } = useForm({
  validationSchema,
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const doHandleLogin = async (values: { email: string, password: string }) => {
  if (inProgress.value) {
    return
  }

  errorMessage.value = ''
  inProgress.value = true

  try {
    const { error } = await auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })
    if (error) {
      throw new Error(error.message)
    }
    router.push('/')
  }
  catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message
    }
    else {
      errorMessage.value = 'An unknown error occurred'
    }
  }
  finally {
    inProgress.value = false
  }
}

const handleForm = handleSubmit(doHandleLogin)
</script>

<template>
  <Card class="mx-auto max-w-sm min-w-[350px]">
    <CardHeader>
      <CardTitle class="text-2xl">
        Login
      </CardTitle>
      <CardDescription>
        Enter your email below to login to your account
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input
            id="email"
            v-model="email"
            type="email"
            placeholder="m@example.com"
            v-bind="emailAttrs"
            required
            @keydown.enter="handleForm"
          />
          <p
            v-if="errors.email"
            class="text-red-500"
          >
            {{ errors.email }}
          </p>
        </div>
        <div class="grid gap-2">
          <div class="flex items-center">
            <Label for="password">Password</Label>
            <a
              href="/auth/resetStep1"
              class="ml-auto inline-block text-sm underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            v-model="password"
            type="password"
            required
            v-bind="passwordAttrs"
            @keydown.enter="handleForm"
          />
          <p
            v-if="errors.password"
            class="text-red-500"
          >
            {{ errors.password }}
          </p>
        </div>
        <Button
          type="button"
          class="w-full"
          :disabled="inProgress"
          @click="handleForm"
        >
          <Loader2
            v-if="inProgress"
            class="w-4 h-4 mr-2 animate-spin"
          />
          Login
        </Button>
        <p
          v-if="errorMessage"
          class="text-red-500"
        >
          {{ errorMessage }}
        </p>
        <!--
        <Button variant="outline" class="w-full">
          Login with Google
        </Button> -->
      </div>
      <div class="mt-4 text-center text-sm">
        Don't have an account?
        <a
          href="/auth/register"
          class="underline"
        >
          Sign up
        </a>
      </div>
    </CardContent>
  </Card>
</template>
