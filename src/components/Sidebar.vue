<script lang="ts" setup>
import { useForm } from 'vee-validate'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { toTypedSchema } from '@vee-validate/zod'
import IconClear from './icons/IconClear.vue'
import * as z from 'zod'

import { FormControl, FormLabel, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useFilterStore } from '@/store/store'
import { Gender } from '@/enums/gender.enum'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const items = [
  {
    id: 1,
    label: Gender.male
  },
  {
    id: 2,
    label: Gender.female
  }
] as const

const formSchema = toTypedSchema(
  z
    .object({
      maxAge: z
        .union([
          z.number().min(0).max(150),
          z.string().transform((val) => (val === '' ? undefined : Number(val)))
        ])
        .optional(),
      minAge: z
        .union([
          z.number().min(0).max(150),
          z.string().transform((val) => (val === '' ? undefined : Number(val)))
        ])
        .optional(),
      gender: z.enum([Gender.female, Gender.male]).optional()
    })

    .refine(
      (data) => {
        if (data.minAge && data.maxAge) {
          return data.minAge <= data.maxAge
        }
        return true
      },
      {
        message: 'Max age cannot be smaller than min age',
        path: ['maxAge']
      }
    )
)

const { handleSubmit, values, setFieldValue, resetForm, errors } = useForm({
  validationSchema: formSchema,
  initialValues: {
    gender: undefined
  }
})

const state = useFilterStore()

const onSubmit = handleSubmit((values) => {
  state.setFilter(values)
})

const handleReset = () => {
  resetForm()
  state.resetFilter()
}

const anyFilterSet = computed(() => {
  return !!values.gender || !!values.minAge || !!values.maxAge
})

const anyFilterStateSet = computed(() => {
  for (const key in state.filters) {
    if (key.includes('maxAgeminAgegender')) {
      return true
    }
  }

  return !!values.gender || !!values.minAge || !!values.maxAge
})
</script>

<template>
  <aside class="relative border p-[10px] min-w-[200px] h-full">
    <form class="flex flex-col gap-4 mt-6" @submit="onSubmit">
      <button
        :class="
          cn(
            'flex py-2 justify-center gap-2 items-center absolute right-0 top-0 cursor-pointer   text-slate-600 hover:text-slate-700 duration-200',
            !anyFilterStateSet &&
              'text-muted-foreground hover:text-muted-foreground cursor-default '
          )
        "
        @click="handleReset"
        :disabled="!anyFilterStateSet"
      >
        <p class="text-sm pb-[2px]">reset all</p>
        <IconClear class="w-4 h-4" />
      </button>

      <FormField v-slot="{ componentField }" name="maxAge">
        <FormItem>
          <FormControl>
            <Input type="number" placeholder="max age" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="minAge">
        <FormItem>
          <FormControl>
            <Input type="number" placeholder="min age" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-for="item in items" :key="item.label" v-slot="{ field }" name="gender">
        <FormItem class="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              :checked="field.value === item.label"
              @update:checked="
                (checked) => setFieldValue('gender', checked ? item.label : undefined)
              "
            />
          </FormControl>
          <FormLabel class="font-normal">
            {{ item.label.charAt(0).toUpperCase() + item.label.slice(1) }}
          </FormLabel>
        </FormItem>
      </FormField>

      <Button class="w-full" type="submit" :disabled="!anyFilterSet"> Find </Button>
    </form>
  </aside>
</template>
