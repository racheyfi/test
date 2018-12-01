const fetch = require('node-fetch');
const packageService = require('../../services/packages');

async function getTree(name, version) {
    let root = {};
    root[name] = version;
    let myPackagesQueue = [root];
    try {
        const graph = await getUnknownNodes(myPackagesQueue);
        const result = await packageService.insertNodes(graph);
        const rootNodeChildren = await packageService.getPackageTree(graph[0].name);
        return nodesToNestedArray(rootNodeChildren);
    } catch (e) {
        console.log(e);
    }

}

async function getUnknownNodes(queue) {
    let { name, version } = await getData(queue[0]);
    queue[0][name] = version; // change version name to the version exists on API
    let graph = [{ name: getNodeKey(name, version), parent: null }];
    let visited = [];
    while (queue.length > 0) {
        const [key, value] = Object.entries(queue[0])[0];
        const isNodeExists = await packageService.isExists(getNodeKey(key, value));
        if (!isNodeExists) {
            let { name, version, dependencies } = await getData(queue[0]);
            let curr = getNodeKey(name, version);
            if (name) {
                if (typeof dependencies !== 'undefined' && Object.keys(dependencies).length) {
                    let result = getDepnendciesAsNode(dependencies, visited, curr);
                    graph = graph.concat(result);
                }
                visited[curr] = version;
                addDependencyToQueue(queue, dependencies, visited);
            }
        }
        queue.shift();
    }
    return graph;
}

function getDepnendciesAsNode(deps, visited, parent) {
    let result = [];
    Object.keys(deps).forEach((packge => {
        let packageKey = getNodeKey(packge, deps[packge]);
        if (!visited[packageKey]) {
            result.push({ name: packageKey, parent: parent })
        }
    }));
    return result;
}

async function getData(url) {
    let name = Object.keys(url)[0];
    let version = removePrefix(url[name]);
    try {
        const response = await fetch(`https://registry.npmjs.org/${name}/${version}`);
        const json = await response.json();
        return json;
    } catch (error) {
        console.log(error);
    }
}

function removePrefix(version) {
    let prefixArray = ['~', '^', '<', '>', '='];
    prefixArray.forEach((prefix) => {
        version.replace(prefix, '');
    });
    return version;
}

function addDependencyToQueue(queue, dependecies, visited) {
    for (var package in dependecies) {
        let node = {};
        node[package] = dependecies[package];
        let nodeKey = getNodeKey(package, node[package]);
        if (typeof  visited[nodeKey] === 'undefined')
            queue.push(node);
    }
}

function getNodeKey(name, version) {
    return `${name}_v${version}`;
}

function nodesToNestedArray(rootNodeChildren) {
    // getting root into the the the packages
    const packages = [
        { package: rootNodeChildren[0].package, parent: null, level: -1 },
        ...rootNodeChildren[0].children
    ];
    //prepare the result for client
    nodes = packages.map(package => ({ name: package.package, parent: package.parent }));

    let map = {}, node, roots = [], i;
    for (i = 0; i < nodes.length; i += 1) {
        map[nodes[i].name] = i; // initialize the map
        nodes[i].children = []; // initialize the children
    }
    for (i = 0; i < nodes.length; i += 1) {
        node = nodes[i];
        if (node.parent) {
            // if you have dangling branches check that map[node.parentId] exists
            nodes[map[node.parent]].children.push(node);
        } else {
            roots.push(node);
        }
    }
    return roots;
}

module.exports = {
    getTree
};
