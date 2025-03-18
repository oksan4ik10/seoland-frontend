import { useRef, useState } from "react";
import CreateHead from "../../../components/CreateHead/CreateHead";
import ProjectForm from "../../../components/ProjectForm/ProjectForm";

import { api } from "../../../store/api/api";
import ErrorPages from "../../Error/ErrorPages";

interface IProps {
    edit: boolean
}

function ProjectsCreate(props: IProps) {
    const { edit } = props;
    const btnSubmitRef = useRef<HTMLInputElement>(null);

    const [sendFormFilters, setSendFormFilters] = useState(false);

    const clickSave = () => {
        if (btnSubmitRef.current) { btnSubmitRef.current.click() }
        setSendFormFilters(true)
    }

    const [createProject, { isError: createError }] = api.useCreateProjectMutation();

    if (createError) return <ErrorPages></ErrorPages>


    return (
        <>
            <CreateHead redirect={false} title={"Карточка проекта"} nameFunc="save" namePage="projects" saveFunc={clickSave} />
            <ProjectForm sendFormFilters={sendFormFilters} edit={edit} funcRequest={createProject} refBtn={btnSubmitRef}></ProjectForm>


        </>
    )
}
export default ProjectsCreate