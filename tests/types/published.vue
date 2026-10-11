<script setup lang="ts">
import { AgentIcon } from '@onlikee/octicons-vue'
import AccessibilityInsetIcon from '@onlikee/octicons-vue/icons/accessibility-inset'
</script>

<template>
  <AgentIcon :size="24" fill="red" aria-label="Agent" />
  <AccessibilityInsetIcon size="large" />
  <!-- @vue-expect-error CSS lengths must also be rejected by the published declaration. -->
  <AgentIcon size="1.25em" />
</template>
