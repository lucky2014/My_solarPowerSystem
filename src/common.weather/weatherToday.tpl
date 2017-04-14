<div class="swiper-wrapper">
	{{#each this}}
    <div class="weatherToday swiper-slide">
    	<p>
		    <span>{{getWeatherDate ord}}</span>
		    <b>{{weatherDay}}</b>
		    <i>{{tempNight}}°C/{{tempDay}}°C</i>
		</p>
		<p style="border-bottom: 1px solid #878f9a; height:25px;">
		    {{wdNight}}/{{wspdDay}}
		    {{#if icon_night}}<img src="http://121.42.167.167:8080{{icon_night}}" />{{/if}} {{#if icon_day}}<img src="http://121.42.167.167:8080{{icon_day}}" />{{/if}}
		</p>
    </div>
    {{/each}}
</div>



