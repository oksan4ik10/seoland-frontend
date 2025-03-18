import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom'

import { api } from "../../../store/api/api";
import ErrorPages from '../../Error/ErrorPages';

import CreateHead from '../../../components/CreateHead/CreateHead';
import ProjectForm from '../../../components/ProjectForm/ProjectForm';

interface IProps {
    edit: boolean;
    nameFunc: string;
}
function ProjectShowEdit(props: IProps) {
    const { id } = useParams();
    const { edit, nameFunc } = props;
    const { data, error, isLoading } = api.useGetProjectQuery(id ? id : "-2");
    const [editProject, { isError: editError }] = api.useEditProjectMutation();


    const btnSubmitRef = useRef<HTMLInputElement>(null)
    const [sendFormFilters, setSendFormFilters] = useState(false);

    const clickSave = () => {
        if (btnSubmitRef.current) { btnSubmitRef.current.click() }
        setSendFormFilters(true)
    }


    if (isLoading) return (<h2>Загрузка данных</h2>)
    if (error || editError) return (<ErrorPages></ErrorPages>)


    if (!data) return <ErrorPages></ErrorPages>
    if (data) return (
        <> <CreateHead title="Карточка проекта" redirect={false} nameFunc={nameFunc} saveFunc={clickSave} namePage="projects" />
            <ProjectForm sendFormFilters={sendFormFilters} funcRequest={editProject} data={data} edit={edit} refBtn={btnSubmitRef} id={id} ></ProjectForm>
        </>
    )
}

export default ProjectShowEdit