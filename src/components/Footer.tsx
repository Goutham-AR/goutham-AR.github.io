import styles from "./Footer.module.css"

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className={styles.footer}>
      <p className={styles.copyright}>
        {/* <span className={styles.prompt}>$</span> echo "Built with React & TypeScript" */}
      </p>
      <p className={styles.year}>© {currentYear} Goutham AR</p>
    </footer>
  )
}

export default Footer
