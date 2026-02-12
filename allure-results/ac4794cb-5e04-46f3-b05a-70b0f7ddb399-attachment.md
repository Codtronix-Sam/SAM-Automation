# Page snapshot

```yaml
- text: Add New Rate
- paragraph: Rate Name *
- textbox "Driver from wise": Darren Watts Rate
- paragraph: Admin Fee Rate Before VAT *
- text: £
- spinbutton: "150"
- text: VAT 20%
- checkbox [checked]
- text: This tax rate will be applied to your fee calculation.
- paragraph: Admin Fee Rate After VAT
- textbox [disabled]: £180
- paragraph: Invoice Model *
- combobox: Ratnam Invoicing
- paragraph: Select Driver *
- combobox: Custom
- textbox "Search and select driver by name...": Darren Watts
- text: Drivers
- separator
- progressbar:
  - img
- button "Cancel"
- button "Add"
```