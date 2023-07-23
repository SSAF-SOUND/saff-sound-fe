export const routes = {
  root: () => '/',
  main: () => '/main',
  articles: {
    self: () => '/articles',
    category: (categoryId: number) => `${routes.articles.self()}/${categoryId}`,
    detail: (categoryId: number, articleId: number) =>
      `${routes.articles.category(categoryId)}/${articleId}`,
  },

  //
  signIn: () => '/auth/sign-in',
  userRegister: () => '/auth/register',

  //
  certification: {
    student: () => '/certification/student',
  },

  //
  intro: {
    studentCertification: () => '/intro/student-certification',
  },

  profile: {
    self: () => '/profile',
    detail: (id: number) => `${routes.profile.self()}/${id}`,

    myInfoSettings: () => `${routes.profile.self()}/myinfo-settings`,
    edit: {
      myInfo: (field: EditableMyInfoFields) =>
        `${routes.profile.myInfoSettings()}/${field}/edit`,

      portfolio: () => `${routes.profile.self()}/portfolio/edit`,
    },
  },

  //
  unauthorized: () => '/unauthorized',
};

export enum EditableMyInfoFields {
  SSAFY_BASIC_INFO = 'ssafy-basic-info', // 기수, 캠퍼스, 멤버여부(학생 인증시 못바꿈)
  NICKNAME = 'nickname',
  IS_MAJOR = 'is-major',
  TRACK = 'track', // 인증된 상태에서만 바꿀 수 있음
}
