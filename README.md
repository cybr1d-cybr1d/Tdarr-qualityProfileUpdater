# Tdarr-qualityProfileUpdater
Update the quality profile of a movie in Radarr using the filename

This flow plugin for Tdarr uses the filename to search Radarr for a matching movie, then update the quality profile to a different profile id.

I use this plugin to update movies to a x265 profile that will not upgrade them after transcoding them with Tdarr. This lets me convert to x265 without worrying about Radarr trying to upgrade back to x264. The plugin can also turn monitoring on or off when updating a movie.

My flow ex:

Preprocessing -> transcode -> replace original file -> update quality profile -> notify radarr

To use the plugin:

Go to the directory /Tdarr_Updater/server/Tdarr/Plugins/FlowPlugins/CommunityFlowPlugins/tools/
Create a folder named qualityProfileUpdater
Inside qualityProfileUpdater create a folder called 1.0.0
The directory should look like /Tdarr_Updater/server/Tdarr/Plugins/FlowPlugins/CommunityFlowPlugins/tools/qualityProfileUpdater/1.0.0/
Place the index.js file in the 1.0.0 folder
Restart Tdarr
You should now see the plugin on the flows page under tools. I'm not sure how to get the plugin to work from the local plugins folder, but it seems to work from the community folder as long as you don't do a plugin update. If anyone knows how to get this to work from local, please let me know.

you can find your profile id using:

http://radarrUrl/api/v3/qualityprofile?apikey=yourAPIKey

Replace radarrUrl with yours including port if necessary and yourAPIKey with your radarr API key (in radarr go to settings > general  and show advanced). 

You can paste this into your browser to see the different quality profiles you have. There will be a list of elements starting with 0. Each one has a name telling your what profile it is and there should be a field at the bottom of each element with the id number. This is the id number you need to give the plugin so it knows which profile to upate to.
