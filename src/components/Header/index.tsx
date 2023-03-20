import Link from 'next/link'
import { SignInButton } from '../SignInButton'
import styles from './styles.module.scss'
import Image from 'next/image'
import logo from '../../../public/images/logo.svg'

export function Header() {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link legacyBehavior href="/">
                    <a>
                        <Image src={logo} alt="Logo Board" />
                    </a>
                </Link>
                <nav>
                    <Link href="/">
                        Home
                    </Link>
                    <Link href="/board">
                        Meu Board
                    </Link>
                </nav>

                <SignInButton />
            </div>
        </header>
    )
}