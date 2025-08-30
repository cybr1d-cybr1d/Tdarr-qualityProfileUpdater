const details = () => ({
    id: 'Radarr_Quality_Profile_Updater',
    Stage: 'Post-processing',
    Name: 'Radarr Quality Profile Updater',
    Type: 'Video',
    Operation: 'Transcode',
    Description: `Updates Radarr quality profile based on the input filename`,
    Version: '1.00',
    Tags: '',

    Inputs: [
		{
            name: 'radarrApiKey',
            type: 'text',
            tooltip: 'The API key for Radarr.',
        },
        {
            name: 'radarrUrl',
            type: 'text',
            defaultValue: 'http://localhost:7878',
            tooltip: 'The URL for Radarr, including http:// and the port if necessary.',
        },
        {
            name: 'qualityProfileId',
            type: 'number',
            tooltip: 'The Radarr quality profile ID to set for the movie. This can be found using /api/v3/qualityprofile',
        },
        {
            name: 'monitored',
            type: 'boolean',
            defaultValue: 'false',
            inputUi: {
                type: 'switch',
            },
            tooltip: 'true or false'
        },
        // You can add more inputs here as needed for other configurations
    ],
});

const plugin = async function (file, librarySettings, inputs, otherArguments) {
    const lib = require('../methods/lib')(); // Assuming this method for loading defaults and utilities is correct
    const axios = require('axios').default;
	//var fileUtils_1 = require('../FlowPlugins/FlowHelpers/1.0.0/fileUtils');
	const path = require('path');
    inputs = lib.loadDefaultValues(inputs, details);

    // Retrieve inputs from plugin configuration
    const radarrApiKey = inputs.radarrApiKey;
    const radarrUrl = inputs.radarrUrl;
    const qualityProfileId = inputs.qualityProfileId;
    const monitored = inputs.monitored;
    const extension = path.extname(file._id).slice(1);
    const filenameWithoutExtension = path.parse(path.basename(file._id)).name; // Using the input filename from the inputFileObj
    const filename = `${filenameWithoutExtension}.${extension}`;
    //args.jobLog(`Filename: "${filename}"`);


    try {
        // Lookup movie by filename in Radarr
        const searchUrl = `${radarrUrl}/api/v3/movie/lookup?term=${encodeURIComponent(filename)}&apikey=${radarrApiKey}`;
        const searchResponse = await axios.get(searchUrl);
        if (searchResponse.data.length === 0 || !searchResponse.data[0].movieFile) {
            throw new Error('No matching movie file found in Radarr.');
        }

        const movieFile = searchResponse.data[0].movieFile;
        if (movieFile.relativePath !== filename) {
            throw new Error('Found movie file does not match input filename.');
        }

        const movieId = movieFile.movieId;

        const movieDetailsResponse = await axios.get(`${radarrUrl}/api/v3/movie/${movieId}?apikey=${radarrApiKey}`);
        const movieDetails = movieDetailsResponse.data;

        const updatedMovieDetails = {
            ...movieDetails,
            qualityProfileId: qualityProfileId,
            monitored: monitored,
        };

        // Update the movie's quality profile in Radarr
        await axios.put(`${radarrUrl}/api/v3/movie/${movieId}?apikey=${radarrApiKey}`, updatedMovieDetails, {
            headers: { 'Content-Type': 'application/json' },
        });

        //args.jobLog(`Quality profile updated for movie ID: ${movieId}.`);
    } catch (error) {
        //args.jobLog(`Error updating quality profile: ${error.message}`);
        return {
            outputFileObj: file,
            outputNumber: 1, // Continue to next plugin even in case of error. this needs to be fixed
            //variables: args.variables,
        };
    }

    return {
        outputFileObj: file,
        outputNumber: 1,
        //variables: args.variables,
    };
};

module.exports.details = details;
module.exports.plugin = plugin;
