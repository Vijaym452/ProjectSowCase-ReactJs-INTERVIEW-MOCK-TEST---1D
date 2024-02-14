import {Component} from 'react'
import Loader from 'react-loader-spinner'

import './index.css'
import Header from '../Header'
import ProjectItem from '../ProjectItem'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProjectShowCase extends Component {
  state = {
    projectsList: [],
    activeCategory: categoriesList[0].id,
    apiStatus: apiStatusConstants.inProgress,
  }

  componentDidMount() {
    this.getProjects()
  }

  getProjects = async () => {
    const {activeCategory} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeCategory}`
    const response = await fetch(apiUrl)
    const data = await response.json()
    console.log(response)
    if (response.ok === true) {
      const updatedData = data.projects.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        imageUrl: eachItem.image_url,
      }))

      this.setState({
        projectsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeCategory = event => {
    this.setState(
      {
        activeCategory: event.target.value,
        apiStatus: apiStatusConstants.inProgress,
      },
      this.getProjects,
    )
  }

  renderLoaderView = () => (
    <div className="loader" data-testid="loader">
      <Loader type="ThreeDots" color="#328af2" height={50} width={50} />
    </div>
  )

  onRetry = () => {
    this.setState({apiStatus: apiStatusConstants.inProgress}, this.getProjects)
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button className="retry-btn" onClick={this.onRetry} type="button">
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {projectsList} = this.state
    return (
      <ul className="list-container">
        {projectsList.map(eachItem => (
          <ProjectItem key={eachItem.id} project={eachItem} />
        ))}
      </ul>
    )
  }

  renderResult = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {activeCategory} = this.state
    return (
      <div className="app-container">
        <Header />
        <div className="main-container">
          <select
            value={activeCategory}
            className="select"
            onChange={this.onChangeCategory}
          >
            {categoriesList.map(eachItem => (
              <option value={eachItem.id} key={eachItem.id}>
                {eachItem.displayText}
              </option>
            ))}
          </select>
          {this.renderResult()}
        </div>
      </div>
    )
  }
}

export default ProjectShowCase
