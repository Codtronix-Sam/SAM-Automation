# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - img [ref=e6]
    - generic [ref=e12]: Welcome to SAM Onboarding
    - generic [ref=e13]:
      - generic [ref=e14]: Email*
      - generic [ref=e16]:
        - textbox "example@yahoo.com" [ref=e17]
        - group
    - generic [ref=e18]:
      - generic [ref=e19]: Password*
      - generic [ref=e21]:
        - textbox [ref=e22]
        - group
    - button "Log in" [ref=e23] [cursor=pointer]: Log in
    - link "Forgot Password?" [ref=e24] [cursor=pointer]:
      - /url: /forgotPassword
  - img
```