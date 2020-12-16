class TimerDashBoard extends React.Component{
    state = {
        timers:[
            {
                title:"Practice Squat",
                project: "Gym Chores",
                id: uuid.v4(),
                elapsed: 545300,
                runningSince: Date.now()
            },
            {
                title:"Bake Squash",
                project: "Kitchen Chores",
                id: uuid.v4(),
                elapsed: 1545300,
                runningSince: Date.now()
            },
        ]
    }

    handleCreateForm = (timer) => {
        this.createTimer(timer)
    }
    createTimer = (timer) => {
        const t = helpers.newTimer(timer)
        this.setState({timers : this.state.timers.concat(t)})
    }

    handleEditForm = (timer) => {
        this.editTimer(timer)
    } 
    editTimer = (attr) => {
        const newTimer = this.state.timers.map((timer) => {
            if(timer.id === attr.id ){
                return Object.assign({}, timer, {
                    title: attr.title,
                    project: attr.project
                })
            } else return timer;
        })
        this.setState({timers: newTimer})
    }
    
    handleDeleteTimer = (id) => {
        this.deleteTimer(id)
    }
    deleteTimer = (id) => {
        this.setState({ timers: this.state.timers.filter(timer => timer.id !== id)})
    }

    handleStartClick = (id) => {
        this.startTimer(id)
    }
    startTimer = (id) => {
        const now = Date.now()
        this.setState({
            timers: this.state.timers.map(timer => {
                if(timer.id == id)
                    return Object.assign({}, timer, {
                        runningSince: now
                    })
                else return timer
            })
        })
    }
    
    handleStopClick = (id) => {
        this.stopTimer(id)
    }
    stopTimer = (id) => {
        this.setState({
            timers: this.state.timers.map(timer => {
                if(timer.id == id){
                    const lastElapsed = Date.now() - timer.runningSince
                    return Object.assign({}, timer, {
                        elapsed: timer.elapsed + lastElapsed,
                        runningSince: null
                    })
                }
                else return timer
            })
        })
    }
    render(){
        return(
            <div className="ui three column centered grid">
                <div className="column">
                    <EditableTimerList 
                    timers={this.state.timers}
                    onFormSubmit={this.handleEditForm}
                    timerDelete={this.handleDeleteTimer}
                    onStartClick={this.handleStartClick}
                    onStopClick={this.handleStopClick}
                    />
                    <ToggleableTimerForm
                        isOpen={true}
                        onFormSubmit={this.handleCreateForm}
                    />
                </div>
            </div>
        );
    }
}

class EditableTimerList extends React.Component{
    render(){
        const timers = this.props.timers.map((timer) => {
            return(
                <EditableTimer 
                title = {timer.title}
                project = {timer.project}
                id = {timer.id}
                key = {timer.id}    
                elapsed = {timer.elapsed}
                runningSince = {timer.runningSince}
                onFormSubmit={this.props.onFormSubmit}
                timerDelete={this.props.timerDelete}
                onStartClick={this.props.onStartClick}
                onStopClick={this.props.onStopClick}
                />
            );
        })
        return (
            <div id="timers">
               {timers}
            </div>
        );
    }
}

class EditableTimer extends React.Component{
    state = {
        editFormOpen: false
    }
    handleFormOpen = () => {
        this.openForm()
    }
    handleFormClose = () => {
        this.closeForm()
    }
    handleFormSubmit = (timer) => {
        this.props.onFormSubmit(timer)
        this.closeForm()
    }
    closeForm = () => {
        this.setState({editFormOpen: false})
    }
    openForm = () => {
        this.setState({editFormOpen: true})
    }
    render(){
        if(this.state.editFormOpen){
            return (
                <TimerForm
                id={this.props.id}
                title={this.props.title}
                project={this.props.project}
                onFormSubmit={this.handleFormSubmit}
                onFormClose={this.handleFormClose}
                />
            );
        } else {
            return(
                <Timer
                id={this.props.id}
                title={this.props.title}
                project={this.props.project}
                elapsed={this.props.elapsed}
                runningSince={this.props.runningSince}
                onFormOpen={this.handleFormOpen}
                timerDelete={this.props.timerDelete}
                onStartClick={this.props.onStartClick}
                onStopClick={this.props.onStopClick}
                />
            );
        }
    }
}

class TimerForm extends React.Component{
    state = {
        title: this.props.title || "",
        project: this.props.project || ""
    }

    handleTitleChange = (e) => {
        this.setState({title: e.target.value})
    }

    handleProjectChange = (e) => {
        this.setState({project: e.target.value})
    }

    handleFormSubmit = (e) => {
        this.props.onFormSubmit({
            id: this.props.id,
            title: this.state.title,
            project: this.state.project
        })
    }

    render(){
        const submitText = this.props.title ? "Update" : "Create"
        return (
            <div className="ui centered card">
                <div className="content">
                    <div className="ui form">
                        <div className="field">
                            <label>Title</label>
                            <input 
                            type="text" 
                            value={this.state.title}
                            onChange={this.handleTitleChange}
                            />
                        </div>
                        <div className="field">
                            <label>Project</label>
                            <input 
                            type="text" 
                            value={this.state.project}
                            onChange={this.handleProjectChange}
                            />
                        </div>
                        <div className="ui two bottom attached buttons">
                            <button 
                            className="ui basic blue button"
                            onClick={this.handleFormSubmit}>
                                {submitText}
                            </button>
                            <button 
                            className="ui basic red button"
                            onClick={this.props.onFormClose}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class ToggleableTimerForm extends React.Component{
    state = {
        isOpen: false
    }
    handleFormOpen = () => {
        this.setState({isOpen:true})
    }
    handleFormClose = () => {
        this.setState({isOpen: false})
    }
    handleFormSubmit = (timer) => {
        this.props.onFormSubmit(timer)
        this.setState({isOpen:false})
    }
    render(){
        if(this.state.isOpen){
            return (
                <TimerForm 
                    onFormSubmit={this.handleFormSubmit}
                    onFormClose={this.handleFormClose}
                />
            );
        } else {
            return (
                <div className="ui basic content center aligned segment">
                    <button 
                    className="ui basic button icon"
                    onClick={this.handleFormOpen}
                    >
                        <i className="plus icon"/>
                    </button>
                </div>
            );
        }
    }
}

class Timer extends React.Component{
    componentDidMount(){
        this.forceUpdateInterval = setInterval(() => this.forceUpdate(), 50)
    }

    componentWillMount(){
        clearInterval(this.forceUpdateInterval)
    }

    handleDeleteTimer = () =>{
        this.props.timerDelete(this.props.id)
    }
    handleStartClick = () => {
        this.props.onStartClick(this.props.id)
    }
    handleStopClick = () => {
        this.props.onStopClick(this.props.id)
    }
    render(){

        const elapsedString = helpers.renderElapsedString(this.props.elapsed, this.props.runningSince);

        return(
            <div className="ui centered card">
                <div className="content">
                    <div className="header">
                        {this.props.title}
                    </div>
                    <div className="meta">
                        {this.props.project}
                    </div>
                    <div className="center aligned description">
                        <h2>
                            {elapsedString}
                        </h2>
                    </div>
                    <div className="extra content">
                        <span 
                        className="right floated edit icon"
                        onClick={this.props.onFormOpen}
                        >
                            <i className="edit icon" />
                        </span>
                        <span 
                        className="right floated trash icon"
                        onClick={this.handleDeleteTimer}
                        >
                            <i className="trash icon" />
                        </span>
                    </div>
                </div>
                <TimerActionButton
                timerIsRunning={!!this.props.runningSince}
                onStartClick={this.handleStartClick}
                onStopClick={this.handleStopClick}
                />
            </div>
        );
    }
}

class TimerActionButton extends React.Component{
    render(){
        if(this.props.timerIsRunning){
            return(
                <div
                className="ui bottom attached red basic button"
                onClick={this.props.onStopClick}
                >
                    Stop
                </div>
            );
        } else {
            return(
                <div
                className="ui bottom attached green basic button"
                onClick={this.props.onStartClick}
                >
                    Start
                </div>
            );
        }
    }
}

ReactDOM.render(
    <TimerDashBoard />,
    document.getElementById("content")
)