
class ProductList extends React.Component{
    state = {
        products: []
    }

    componentDidMount(){
        this.setState({products: Seed.products});
    }

    handleProductUpVote = (id) => {
        const updatedProducts = this.state.products.map((product) => {
            if(product.id == id)
                return Object.assign({}, product, {votes: product.votes + 1})
            else return product;
        })
        this.setState({products: updatedProducts})
    }
    render(){
        const products = this.state.products.sort((a, b) => (
            b.votes - a.votes
        ))
        const productComponent = products.map((product) => {
            return (
             <Product
                id = {product.id} 
                title = {product.title}
                description = {product.description}
                url = {product.url}
                votes = {product.votes}
                submitterAvatarUrl = {product.submitterAvatarUrl}
                productImageUrl = {product.productImageUrl}
                upVote = {this.handleProductUpVote}
                />
            );
            
        })
        return (
            <div className ="ui unstackable items">
               {productComponent}
            </div>
        );
    }
}         

class Product extends React.Component{

    handleUpVote = () => {
        this.props.upVote(this.props.id)
    }
    render(){
        return (
            <div className="item">
                <div className="image">
                    <img src={this.props.productImageUrl}/>
                </div>
                <div className="middle  aligned content">
                    <div className="header">
                        <a onClick={this.handleUpVote}>
                            <i className="large caret up icon"/>
                        </a>
                        {this.props.votes}
                    </div>
                    <div className="description">
                        <a>{this.props.title}</a>
                        <p>{this.props.description}</p>
                    </div>
                    <div className="extra">
                        <span>Submited by:</span>
                        <img 
                         className="ui avatar image"
                         src={this.props.submitterAvatarUrl}
                         />
                    </div>
                </div>
                
            </div>
        );
    }
}
ReactDOM.render(
    <ProductList/>,
    document.getElementById("content")
)