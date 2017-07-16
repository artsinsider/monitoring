/**
 *  TO DO костыль, ожидаем следущей версии модуля авторизации
 */
export const interfaceSettings ={
    fedoseenko:{
        role: 'user',
        post: 'Главный специалист ',
        first: {
            status_deistviya : 5,
            status: 1,
        },
        second: {
            status_deistviya : 3,
            status: 1,
        },
        interface: {
            periods: false,
            section: false,
            sectionCheckEmployee: false,
            resources: false,
            reports: false,
            unist: false,
            extreme: false,
            vozvrat_rukovoditelju: true,
            vozvrat_sotrudniku: true
        },
    },
    sovkov:{
        role: 'user',
        post: 'Главный специалист ',
        first: {
            status_deistviya : 5,
            status: 1,
        },
        second: {
            status_deistviya : 3,
            status: 1,
        },
        interface: {
            periods: false,
            section: false,
            sectionCheckEmployee: false,
            resources: false,
            reports: false,
            unist: false,
            extreme: false,
            vozvrat_rukovoditelju: true,
            vozvrat_sotrudniku: true
        },
    },
    dunaeva:{
        role: 'user',
        post: 'Главный специалист ',
        first: {
            status_deistviya : 5,
            status: 1,
        },
        second: {
            status_deistviya : 3,
            status: 1,
        },
        interface: {
            periods: false,
            section: false,
            sectionCheckEmployee: false,
            resources: false,
            reports: false,
            unist: false,
            extreme: false,
            vozvrat_rukovoditelju: true,
            vozvrat_sotrudniku: true
        },
    },
    klichkov:{
        role: 'chief',
        post: 'Начальник отдела мониторинга',
        first: {
            status_deistviya : 5,
            status: 1,
        },
        second: {
            status_deistviya : 3,
            status: 3,
        },
        interface: {
            periods: true,
            section: false,
            sectionCheckEmployee: true,
            resources: false,
            reports: true,
            unist: false,
            extreme: false,
            vozvrat_sotrudniku: false,
            vozvrat_rukovoditelju: true
        },
    },
    dolotof:{
        role: 'leader',
        post: 'Руководитель департамента',
        first: {
            status_deistviya : 5,
            status: 1,
        },
        second: {
            status_deistviya : 3,
            status: 2,
        },
        interface: {
            periods: true,
            section: true,
            sectionCheckEmployee: true,
            resources: true,
            reports: true,
            unist: true,
            extreme: true,
            vozvrat_sotrudniku: false,
            vozvrat_rukovoditelju: false,

        },
    }
}