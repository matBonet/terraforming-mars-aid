
# terraforming-mars-aid

Click the link below to randomize milestones and awards according to your expansions!

[Base game](https://matbonet.github.io/terraforming-mars-aid?exclude_milestones=lobbyist,pioneer,planetologist&exclude_awards=politician,constructor)

[Venus Next](https://matbonet.github.io/terraforming-mars-aid?exclude_milestones=lobbyist,pioneer&exclude_awards=politician,constructor)

[Colonies](https://matbonet.github.io/terraforming-mars-aid?exclude_milestones=lobbyist,planetologist&exclude_awards=politician)

[Turmoil](https://matbonet.github.io/terraforming-mars-aid?exclude_milestones=pioneer,planetologist&exclude_awards=constructor)

[Venus Next + Colonies](https://matbonet.github.io/terraforming-mars-aid?exclude_milestones=lobbyist&exclude_awards=politician)

[Venus Next + Turmoil](https://matbonet.github.io/terraforming-mars-aid?exclude_milestones=pioneer&exclude_awards=constructor)

[Colonies + Turmoil](https://matbonet.github.io/terraforming-mars-aid?exclude_milestones=planetologist)

[All](https://matbonet.github.io/terraforming-mars-aid)

<sub>\* Feel free to customize the url parameters to better adjust the randomization to your desires!</sub>

# Randomization method

``` mermaid
flowchart LR
  PARAMS(["Initial parameters\n excludedAwards, excludedMilestones \n maxIndividualSynergy, maxTotalSynergy "])
  LOAD_SIN(Load synergy matrix)
  BUILD_SETS("Generate sets of valid Milestones & Awards\n(availableAwards, availableMilestones)")
  INIT_RESULTS("Initialize result sets\n(selectedAwards, selectedMilestones)")

  LEN_CHECK{"Have 5 awards and 5 milestones \n been selected?"}
  CHECK_AW_LARG{"Are there more selected awards?"}
  CHECK_TOTAL_SYN{"Total synergy > maxTotalSynergy?"}
  
  PARAMS --> LOAD_SIN --> BUILD_SETS --> INIT_RESULTS --> LEN_CHECK
  LEN_CHECK --Yes---> CHECK_TOTAL_SYN --Yes---> INIT_RESULTS
  CHECK_TOTAL_SYN --Yes---> DONE((Done))
  LEN_CHECK --No---> CHECK_AW_LARG
  

```

## Free parameters

## Load synergy matrix

## Generate sets of valid awards and milestones

# About

Built with React and bare CSS and HTML.
