<template>
  <NuxtLayout>
    <NuxtPage />
    <ClientOnly>
      <VitePwaManifest />
      <AlertModal />
    </ClientOnly>
  </NuxtLayout>
</template>
