"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fileUtils_1 = require("../../../../FlowHelpers/1.0.0/fileUtils");
exports.plugin = exports.details = void 0;

const details = function () { return ({
    name: 'Radarr Quality Profile Updater',
    description: 'Updates Radarr quality profile based on the input filename.',
    style: {
        borderColor: '#6efefc',
    },
    tags: 'metadata, radarr',
    isStartPlugin: false,
    pType: '',
    requiresVersion: '2.17.01',
    sidebarPosition: -1,
    icon: '',
    inputs: [
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
    ],
    outputs: [
        {
            number: 1,
            tooltip: 'Continue to next plugin',
        },
    ],
}); };
exports.details = details;

const plugin = async function (args) {
    const lib = require('../../../../../methods/lib')(); // Assuming this method for loading defaults and utilities is correct
    const axios = args.deps.axios;
    args.inputs = lib.loadDefaultValues(args.inputs, details);

    // Retrieve inputs from plugin configuration
    const radarrApiKey = args.inputs.radarrApiKey;
    const radarrUrl = args.inputs.radarrUrl;
    const qualityProfileId = args.inputs.qualityProfileId;
    const monitored = args.inputs.monitored;
    const extension = (0, fileUtils_1.getContainer)(args.inputFileObj._id);
    const filenameWithoutExtension = (0, fileUtils_1.getFileName)(args.inputFileObj._id); // Using the input filename from the inputFileObj
    const filename = `${filenameWithoutExtension}.${extension}`;
    args.jobLog(`Filename: "${filename}"`);


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

        args.jobLog(`Quality profile updated for movie ID: ${movieId}.`);
    } catch (error) {
        args.jobLog(`Error updating quality profile: ${error.message}`);
        return {
            outputFileObj: args.inputFileObj,
            outputNumber: 1, // Continue to next plugin even in case of error
            variables: args.variables,
        };
    }

    return {
        outputFileObj: args.inputFileObj,
        outputNumber: 1,
        variables: args.variables,
    };
};
exports.plugin = plugin;
