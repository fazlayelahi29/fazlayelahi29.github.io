import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface Options {
  links?: Record<string, string>
}

export default ((opts?: Options) => {
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

  return Footer
}) satisfies QuartzComponentConstructor