import './index.css'

const ProjectItem = props => {
  const {project} = props
  const {name, imageUrl} = project

  return (
    <li className="list-item">
      <img src={imageUrl} alt={name} className="project-image" />
      <p className="name">{name}</p>
    </li>
  )
}

export default ProjectItem
