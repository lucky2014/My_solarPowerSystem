<ul>
    {{#each this}}
    <li>
        <p>{{getWeatherDate ord}}</p>
        <p><img src="http://121.42.167.167:8080{{icon_night}}" ><img src="http://121.42.167.167:8080{{icon_day}}" /></p>
        <p style=" position: relative; top: -2px;">{{tempNight}}°C/{{tempDay}}°C</p>
    </li>
    {{/each}}
</ul>