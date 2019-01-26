import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

const LoginReg = () => import('@/pages/LoginReg');
const ForgotPassword = () => import('@/pages/ForgotPassword');
const Dashboard = () => import('@/pages/Dashboard');
const Unauthorized = () => import('@/pages/Unauthorized');
const EmailVerification = () => import('@/pages/EmailVerification');
const UserList = () => import('@/views/user/UserList');
const Menu = () => import('@/views/menu/Menu');
const SetMenuPermission = () => import('@/views/menu/SetMenuPermission');
const CreateDepartment = () => import('@/views/department/CreateDepartment');
const Profile = () => import('@/views/user/Profile');
const ChangePassword = () => import('@/views/user/ChangePassword');
const Messenger = () => import('@/views/communication/Messenger');
const TrackByUser = () => import('@/views/location/TrackByUser');
const TrackByWorkOrder = () => import('@/views/location/TrackByWorkOrder');
const Task = () => import('@/views/material/Task');
const Template = () => import('@/views/material/Template');
const Site = () => import('@/views/material/Site');
const WorkOrder = () => import('@/views/workorder/WorkOrder');
const WorkOrderDetail = () => import('@/views/workorder/WorkOrderDetail');
const WorkOrderAssign = () => import('@/views/workorder/WorkOrderAssign');
const CostBreakDown = () => import('@/views/accounts/CostBreakDown');


export default new Router({
    routes: [
        {
            path: '/',
            name: 'LoginReg',
            component: LoginReg,
            meta:{
                requiresAuth: false
            }
        },
        {
            path: '/email-verification/:token',
            name: 'EmailVerification',
            component: EmailVerification,
            meta:{
                requiresAuth: false
            }
        },
        {
            path: '/forgot-password/:token',
            name: 'ForgotPassword',
            component: ForgotPassword,
            meta:{
                requiresAuth: false
            }
        },
        {
            path: '/dashboard',
            name: 'Dashboard',
            component: Dashboard,
            meta:{
                requiresAuth: true
            },
            children: [
                {
                    path: '/manage-menu',
                    name: 'Menu',
                    component: Menu,
                    meta:{
                        requiresAuth: true
                    }
                },
                {
                    path: '/manage-user',
                    name: 'UserList',
                    component: UserList,
                    meta:{
                        requiresAuth: true
                    }
                },
                {
                    path: '/manage-department',
                    name: 'CreateDepartment',
                    component: CreateDepartment,
                    meta:{
                        requiresAuth: true
                    }
                },
                {
                    path: '/set-menu-permission',
                    name: 'SetMenuPermission',
                    component: SetMenuPermission,
                    meta:{
                        requiresAuth: true
                    }
                },
                {
                    path: '/profile',
                    name: 'Profile',
                    component: Profile,
                    meta:{
                        requiresAuth: true
                    }
                },
                {
                    path: '/change-password',
                    name: 'ChangePassword',
                    component: ChangePassword,
                    meta:{
                        requiresAuth: true
                    }
                },
                {
                    path: '/messenger',
                    name: 'Messenger',
                    component: Messenger,
                    meta:{
                        requiresAuth: true
                    }
                },
                {
                    path: '/track-by-user',
                    name: 'TrackByUser',
                    component: TrackByUser,
                    meta:{
                        requiresAuth: true
                    }
                },
                {
                    path: '/task',
                    name: 'Task',
                    component: Task,
                    meta:{
                        requiresAuth: true
                    }
                },
                {
                    path: '/template',
                    name: 'Template',
                    component: Template,
                    meta:{
                        requiresAuth: true
                    }
                },
                {
                    path: '/site',
                    name: 'Site',
                    component: Site,
                    meta:{
                        requiresAuth: true
                    }
                },
                {
                    path: '/work-order',
                    name: 'WorkOrder',
                    component: WorkOrder,
                    meta:{
                        requiresAuth: true
                    }
                },
                {
                    path: '/work-order-detail',
                    name: 'WorkOrderDetail',
                    component: WorkOrderDetail,
                    meta:{
                        requiresAuth: true
                    }
                },
                {
                    path: '/work-order-assign',
                    name: 'WorkOrderAssign',
                    component: WorkOrderAssign,
                    meta:{
                        requiresAuth: true
                    }
                },
                {
                    path: '/track-by-work-order',
                    name: 'TrackByWorkOrder',
                    component: TrackByWorkOrder,
                    meta:{
                        requiresAuth: true
                    }
                },
                {
                    path: '/cost-break-down',
                    name: 'CostBreakDown',
                    component: CostBreakDown,
                    meta:{
                        requiresAuth: true
                    }
                }
            ]
        },
        {
            path: '*',
            name: 'Unauthorized',
            component: Unauthorized
        },
    ],
    mode: 'hash'
})


