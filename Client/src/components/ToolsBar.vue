<script setup lang="ts">
import { ToolsController } from '../classPackage/Controller/ToolsController';

</script>

<template>
    <div id="toolBarBox" class="ui">
        <div id ="subTool" class ="container">
            <div id = "test" class = "item">Option1</div>
            <div id = "test2" class = "item">Option2</div>
            <div id = "test3" class = "item">Option3</div>
            <div id = "test4" class = "item">Option3</div>
            <div id = "test5" class = "item">Option3</div>

        </div>
        <div id="toolsBar" class="container">
            <div id = "build" class = "item">Construire</div>
            <div id = "recruit" class = "item">Recruter</div>
            <div id = "stats" class = "item">Voir unités</div>
        </div>
    </div>
</template>

<style lang="css" scoped>



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