# Tdarr-qualityProfileUpdater
Update the quality profile of a movie in Radarr using the filename

This flow plugin for Tdarr uses the filename to search Radarr for a matching movie, then update the quality profile to a different profile id.

I use this plugin to update movies to a x265 profile that will not upgrade them after transcoding them with Tdarr. This lets me convert to x265 without worrying about Radarr trying to upgrade back to x264. The plugin can also turn monitoring on or off when updating a movie.

My flow ex:

Preprocessing -> transcode -> replace original file -> update quality profile -> notify radarr

you can find your profile id using:

http://radarrUrl/api/v3/qualityprofile?apikey=yourAPIKey

Then find the "id: " for the element that corresponds to the profile you want to update to
