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

const errorMessage = ref('')
const successMessage = ref('')
const inProgress = ref(false)

const validationSchema = toTypedSchema(
  yup.object({
    email: yup.string().required().email(),
  }),
)

const { errors, defineField, handleSubmit } = useForm({
  validationSchema,
})

const [email, emailAttrs] = defineField('email')

const doHandleRecover = async (values: { email: string }) => {
  if (inProgress.value) {
    return
  }

  successMessage.value = ''
  errorMessage.value = ''
  inProgress.value = true

  const runtimeConfig = useRuntimeConfig()

  try {
    const { error } = await auth.resetPasswordForEmail(values.email, {
      redirectTo: `${runtimeConfig.public.APP_URL}/auth/resetStep2`,
    })
    if (error) {
      throw new Error(error.message)
    }
    successMessage.value = 'Password recovery email sent'
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

const handleForm = handleSubmit(doHandleRecover)

const isFormValid = computed(() => {
  return !Object.keys(errors.value).length && email.value && !inProgress.value
})
</script>

<template>
  <Card class="mx-auto max-w-sm min-w-[350px]">
    <CardHeader>
      <CardTitle class="text-xl">
        Recover Password
      </CardTitle>
      <CardDescription>
        Enter your email to recover your password
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
        <Button
          type="button"
          class="w-full"
          :disabled="!isFormValid"
          @click="handleForm"
        >
          <Loader2
            v-if="inProgress"
            class="w-4 h-4 mr-2 animate-spin"
          />
          Send recovery email
        </Button>
        <p
          v-if="successMessage"
          class="text-green-500"
        >
          {{ successMessage }}
        </p>
        <p
          v-if="errorMessage"
          class="text-red-500"
        >
          {{ errorMessage }}
        </p>
        <!-- <Button variant="outline" class="w-full">
          Sign up with GitHub
        </Button> -->
      </div>
      <div class="mt-4 text-center text-sm">
        Already have an account?
        <a
          href="/auth/login"
          class="underline"
        >
          Sign in
        </a>
      </div>
    </CardContent>
  </Card>
</template>
