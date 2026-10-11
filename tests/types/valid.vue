<script setup lang="ts">
import { AccessibilityInsetIcon, AgentIcon } from '../../packages/octicons-vue/src'
import DeepAgentIcon from '../../packages/octicons-vue/src/__generated__/icons/agent'
</script>

<template>
  <AccessibilityInsetIcon :size="24" fill="red" title="Accessibility" vertical-align="middle" />
  <AgentIcon size="small" aria-label="Agent" :tabindex="0" class="custom" :style="{ color: 'red' }" />
  <AgentIcon size="medium" />
  <DeepAgentIcon size="large" />
  <!-- @vue-expect-error CSS lengths are outside the public size contract. -->
  <AgentIcon size="1.25em" />
</template>
