
const Players = require('../models/player');

exports.getPlayers = function (req, res) {
    try {
        let coacheId = req.body?.coacheId;
        const name = req.body?.name;
        let query = {};
        query["$and"] = [];
        if (coacheId) {
            query["$and"].push({
                coacheId: coacheId
            });
        }
        if (name) {
            query["$and"].push({
                name: { $regex: name }
            });
        }

        const perPage = req.body?.perPage || 10;
        const page = req.body?.page || 1;
        Players.find(query, { name: 1, matchesPlayed: 1, matchesWon: 1, matchesLost: 1, coacheId: 1 })
            .skip((perPage * page) - perPage).limit(perPage)
            .then((data) => {
                Players.find(query).countDocuments()
                    .then((count) => {

                        if (data && data.length > 0) {
                            data.forEach((player) => {
                                const total = player.matchesWon - player.matchesLost;
                                player['efficiency'] = total < 0 ? 0 : total;
                            });
                            //Sort the data based on the efficiency
                            data.sort((firstItem, secondItem) => secondItem.efficiency - firstItem.efficiency);
                            res.status(200).json({
                                status: true,
                                sucessMessage: 'Players retrived successfully.',
                                data: data,
                                currentPage: page,
                                totalCount: count,
                                pages: Math.ceil(count / perPage),
                            });
                        } else {
                            res.status(400).json({
                                errorMessage: 'There is no players found!',
                                status: false
                            });
                        }

                    });

            }).catch(err => {
                res.status(400).json({
                    errorMessage: err.message || err,
                    status: false
                });
            });
    } catch (e) {
        console.log("374 :", e);
        res.status(400).json({
            errorMessage: 'Something went wrong while fetching players!',
            status: false
        });
    }
};

exports.add = function (req, res) {
    try {
        const name = req.body?.name;
        const coacheId = req.header('loggedinUserId');
        const matchesPlayed = req.body?.matchesPlayed;
        const matchesWon = req.body?.matchesWon;
        const matchesLost = req.body?.matchesLost;
        if (name && coacheId && (matchesPlayed || matchesPlayed == 0) && (matchesWon || matchesWon == 0) && (matchesLost || matchesLost == 0)) {

            const player = new Players();
            player.coacheId = coacheId;
            player.name = name;
            player.matchesPlayed = matchesPlayed;
            player.matchesWon = matchesWon;
            player.matchesLost = matchesLost;
            player.save((err, data) => {
                if (err) {
                    res.status(400).json({
                        errorMessage: err,
                        status: false
                    });
                } else {
                    res.status(200).json({
                        status: true,
                        sucessMessage: 'Player added successfully.'
                    });
                }
            });

        } else {
            res.status(400).json({
                errorMessage: 'Missing required parameter!',
                status: false
            });
        }
    } catch (e) {
        console.log("e: ", e);
        res.status(400).json({
            errorMessage: 'Something went wrong while adding new player!',
            status: false
        });
    }
};