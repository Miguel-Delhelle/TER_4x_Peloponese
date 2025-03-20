<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.10" tiledversion="1.11.2" name="TexturedGrass" tilewidth="16" tileheight="16" tilecount="6" columns="3">
 <image source="MiniWorldSprites/Ground/TexturedGrass.png" width="48" height="32"/>
 <tile id="1" probability="0.35"/>
 <tile id="2" probability="0.35"/>
 <tile id="4" probability="0.35"/>
 <tile id="5" probability="0.35"/>
 <wangsets>
  <wangset name="Ground_Plains" type="corner" tile="0">
   <wangcolor name="Grass" color="#ff0000" tile="0" probability="1"/>
   <wangcolor name="Tall_Grass" color="#00ff00" tile="3" probability="1"/>
   <wangtile tileid="0" wangid="0,1,0,1,0,1,0,1"/>
   <wangtile tileid="1" wangid="0,1,0,1,0,1,0,1"/>
   <wangtile tileid="2" wangid="0,1,0,1,0,1,0,1"/>
   <wangtile tileid="3" wangid="0,2,0,2,0,2,0,2"/>
   <wangtile tileid="4" wangid="0,2,0,2,0,2,0,2"/>
   <wangtile tileid="5" wangid="0,2,0,2,0,2,0,2"/>
  </wangset>
 </wangsets>
</tileset>
