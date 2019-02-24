import React from 'react';
import Title from './Title/Title'
import SideBar from '../components/SideBar/SideBar';
import Input from './Input/Input'
import Button from '../components/Button/Button'
import '../assets/scss/App.scss';
import Card from "./Card/Card";
import Tree from 'react-tree-graph';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            graph: null,
            packageName: null,
            packageVersion: null,
            isSearching: false
        };
        this.getGraph = this.getGraph.bind(this);
        this.getGraphCard = this.getGraphCard.bind(this);
    }

    getGraph() {
        const { packageVersion, packageName } = this.state;
        this.setState({ isSearching: true });
        fetch(`http://127.0.0.1:8082/api/packages/${packageName}/${packageVersion}`).then((res) => {
            return res.json();
        }).then((result) => {
            this.setState({ graph: result, isSearching: false });
        }).catch((err) => {
            console.log(err)
        });
    }

    getPackageVersion(packageVersion) {
        this.setState({ packageVersion });
    }

    getPackageName(packageName) {
        this.setState({ packageName });
    }

    getEmptyState() {
        return (
            <Card className='packages-app__content__main__empty-state'>
                <img
                    src="https://snyk.io/wp-content/uploads/Container-Vulnerability-Management-For-Developers-small.png" />
                <h3>Hey there , Searching for Packages Tree ?</h3>
            </Card>
        )
    }

    getGraphCard() {
        return (
            <Card className='packages-app__content__main__graph-card'>
                <Tree
                    data={this.state.graph[0]}
                    height={400}
                    width={600}
                    animated
                    svgProps={{
                        className: 'custom'
                    }}
                    steps={50}
                />
            </Card>
        )
    }

    render() {
        const { graph, isSearching } = this.state;
        return (
            <div className="packages-app">
                <Title text={'Snyk.io'} />
                <content class="packages-app__content">
                    {graph ? 'graph' : 'loading'}
                    <SideBar title="Search">
                        <Input placeholder="package name" getValue={(value) => this.getPackageName(value)}
                               name="packge" />
                        <Input placeholder="version" getValue={(value) => this.getPackageVersion(value)}
                               name="version" />
                        <Button
                            action={this.getGraph}
                            value={isSearching ? "Searching.." : "Search"}
                        />
                    </SideBar>
                    <main className="packages-app__content__main">
                        {!graph && this.getEmptyState()}
                        {graph && this.getGraphCard()}
                    </main>
                </content>
            </div>
        );
    }
}

export default App;
