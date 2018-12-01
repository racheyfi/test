const Packages = require('../server/models/packages');

const getPackageTree = async (packageName) => {
    return await Packages.aggregate([
        { $match: { package: packageName } },
        {
            $graphLookup: {
                from: 'packages',
                startWith: '$package',
                connectFromField: 'package',
                connectToField: 'parent',
                as: 'children',
                depthField: "level"
            }
        }
    ])
};

const insertNodes = async (nodesArray) => {
    const queries = nodesArray.map(node => {
        return {
            updateOne: {
                "filter": { "package": node.name, "parent": node.parent },
                "update": {
                    $setOnInsert: {
                        package: node.name,
                        parent: node.parent
                    }
                },
                "upsert": true
            }
        }
    });
    return await Packages.bulkWrite(queries);
};

const isExists = async (packageName) => {
    const package = await Packages.findOne({ package: packageName });
    if (package) {
        return true;
    }
    return false;
};

module.exports = {
    isExists,
    getPackageTree,
    insertNodes
};
