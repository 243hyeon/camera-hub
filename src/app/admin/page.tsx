import Link from 'next/link'

export default function AdminDashboard() {
    const menus = [
        { title: '뉴스 관리', description: '시장 이슈, 신제품, SW 이슈 뉴스 작성 및 관리', href: '/admin/news', icon: '📰' },
        { title: '카메라 관리', description: '카메라 바디 정보 추가, 수정, 삭제', href: '/admin/cameras', icon: '📷' },
        { title: '렌즈 관리', description: '렌즈 정보 추가, 수정, 삭제', href: '/admin/lenses', icon: '🔍' },
    ]

    return (
        <main className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8">관리자 대시보드</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {menus.map((menu) => (
                    <Link
                        key={menu.href}
                        href={menu.href}
                        className="p-8 border rounded-2xl hover:shadow-xl transition-all bg-white dark:bg-zinc-900 group"
                    >
                        <div className="text-4xl mb-4">{menu.icon}</div>
                        <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600">{menu.title}</h2>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm">{menu.description}</p>
                    </Link>
                ))}
            </div>
        </main>
    )
}
