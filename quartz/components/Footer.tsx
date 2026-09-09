import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"

export default (() => {
  const Footer: QuartzComponent = ({ displayClass }) => {
    const year = new Date().getFullYear()
    const syncTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Dhaka",
      dateStyle: "full",
      timeStyle: "long"
    })

    return (
      <footer class={`${displayClass ?? ""}`}>
        <p>
          © {year} Fazlay Elahi. All rights reserved.
        </p>
        <p>
          Last synced: {syncTime}
        </p>
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor