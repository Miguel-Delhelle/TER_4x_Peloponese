<script setup lang="ts">
import { ToolsController } from '../classPackage/controller/ToolsController';

</script>

<template>
    <div id="toolsBarContent" class="ui container">
        <div id = "build" class = "item">Construire</div>
            <div id="subToolBuild" class="item subTool">Option1/Option2/Option3/Option4</div>
        <div id = "recruit" class = "item">Recruter</div>
        <div id = "stats" class = "item">Voir unités</div>
    </div>
</template>

<style lang="css" scoped>

.subTool{
    visibility:hidden;
}

.container{
    background-color: rgba(255, 20, 150, 0.85);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 0px;
}
.item{
    align-self: center;
    padding: 3px;
    margin: 5px;
}

.item:hover {
  background-color: rgb(180, 20, 150);
  cursor: pointer;
}

</style>