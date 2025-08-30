# Tdarr-qualityProfileUpdater
Update the quality profile of a movie in Radarr using the filename

This plugin for Tdarr uses the filename to search Radarr for a matching movie, then update the quality profile to a different profile id.

I use this plugin to update movies to a x265 profile that will not upgrade them after transcoding them with Tdarr. This lets me convert to x265 without worrying about Radarr trying to upgrade back to x264. The plugin can also turn monitoring on or off when updating a movie.

Flow ex:

Preprocessing -> transcode -> replace original file -> update quality profile -> notify radarr

1. To use the plugin, copy it into your local plugin directory: Tdarr_Updater\server\Tdarr\Plugins\Local\
2. Restart Tdarr
3. You should now see it the it in the Classic Plugins tab under Local

This a classic plugin, but it can be used in a flow by using the "Run Classic Transcode Plugin" block and selecting the plugin.

The plugin takes the following parameters:

1. Radarr URL: <localhost:7878>
2. Radarr API Key: <key>
3. Radarr Profile ID: The ID of the profile you want to change to. Keep this the same as the current profile if you don't want to change it.
4. Monitored: Ticked=Monitored flag will be set

You can find your profile ID using the below URL in your browser:

http://<radarrUrl>/api/v3/qualityprofile?apikey=<yourAPIKey>

Replace <radarrUrl> with yours (ex: localhost:7878) and <yourAPIKey> with your Radarr API key (in Radarr go to settings > general and show advanced). 

You can paste this into your browser to see the different quality profiles you have. There will be a list of elements starting with 0. Each one has a name telling you what profile it is and there should be a field at the bottom of each element with the id number. This is the id number you need to give the plugin so it knows which profile to upate to. Be sure to get the correct ID number, as the displayed data will have multiple ID numbers for different parts of the data hierarchy. You want the ID number for the quality profile.
