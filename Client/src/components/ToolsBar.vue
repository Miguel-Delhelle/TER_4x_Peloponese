<script setup lang="ts">
import { ToolsController } from '../classPackage/controller/ToolsController';

</script>

<template>
    <div id="toolsBarContent" class="ui container">
        <div id = "build" class = "item">Construire//</div>
        <div id = "recruit" class = "item">Recruter//</div>
        <div id = "stats" class = "item">Voir unités//</div>
    </div>
</template>

<style lang="css" scoped>

.container{
    background-color: deeppink;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
}
.item{
    align-self: center;
}

</style>