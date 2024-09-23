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

const errorMessage = ref('')
const successMessage = ref('')
const inProgress = ref(false)

const validationSchema = toTypedSchema(
  yup.object({
    password: yup.string().required().min(8, 'Password must be at least 8 characters'),
  }),
)

const { errors, defineField, handleSubmit } = useForm({
  validationSchema,
})

const [password, passwordAttrs] = defineField('password')

const doHandleRecover = async (values: { password: string }) => {
  if (inProgress.value) {
    return
  }

  successMessage.value = ''
  errorMessage.value = ''
  inProgress.value = true

  try {
    const { error } = await auth.updateUser({ password: values.password })
    if (error) {
      throw new Error(error.message)
    }
    successMessage.value = 'Password updated'
    await router.push('/')
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
</script>

<template>
  <Card class="mx-auto max-w-sm min-w-[350px]">
    <CardHeader>
      <CardTitle class="text-xl">
        Reset Password
      </CardTitle>
      <CardDescription>
        Enter your new password
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="password">Password</Label>
          <Input
            id="password"
            v-model="password"
            type="password"
            v-bind="passwordAttrs"
            required
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
          Update Password
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
