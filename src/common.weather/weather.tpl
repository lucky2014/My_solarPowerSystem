<ul>
    {{#each weatherBeanVOs}}
    <li>
        <p>
            <span>{{getWeatherDate ord}}</span>
            <b>{{weatherDay}}</b>
            <i>{{tempNight}}°C/{{tempDay}}°C</i>
        </p>
        <p>
            <span>{{wdNight}}/{{wspdDay}}</span>
            {{#if icon_night}}<img src="http://121.42.167.167:8080{{icon_night}}" />{{/if}} {{#if icon_day}}<img src="http://121.42.167.167:8080{{icon_day}}" />{{/if}}
        </p>
    </li>
    {{/each}}
</ul>