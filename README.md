
# terraforming-mars-aid

A randomizer for Milestones & Awards in the Terraforming Mars board game. Open the app, configure which expansions you own in Settings, and roll.

[Play](https://matbonet.github.io/terraforming-mars-aid)

---

# Architecture

```mermaid
flowchart TB
    subgraph data["src/ma-data/"]
        MJ["milestones.json"]
        AJ["awards.json"]
        SJ["synergies.json"]
    end

    subgraph rand["randomizer.js · pure functions"]
        R["generateMilestonesAwards\ngenerateMilestonesOnly · generateAwardsOnly\ngenerateSingleMilestone · generateSingleAward\n\nAccepts: availableMilestones, availableAwards"]
    end

    subgraph store["store.js · Zustand"]
        ST["State\n availableMilestones · availableAwards · draw · showDescriptions\n\nActions\n rerandomize · rerandomizeMilestones · rerandomizeAwards\n rerollMilestone · rerollAward\n removeMilestone · removeAward\n setAvailable · setShowDescriptions"]
    end

    subgraph ui["React Components"]
        App["App\nlayout · settingsOpen"]
        NavBar["NavBar"]
        MA["MilestonesAwards\ntype · cards · orient · tooFew"]
        Card["Card\nslug · type · title · description"]
        SM["SettingsModal"]
    end

    SJ --> rand
    MJ & AJ --> store
    rand --> store
    store -- "read state" --> ui
    ui -- "call actions" --> store
    App --> NavBar & MA & SM
    MA --> Card
```

---

# Randomization method

```mermaid
flowchart LR
  PARAMS(["Available milestones & awards\nmaxIndividualSynergy · maxTotalSynergy"])
  LOAD_SIN(Load synergy matrix)
  INIT_RESULTS("Initialize result sets\nselectedAwards · selectedMilestones")

  LEN_CHECK{"5 awards and\n5 milestones\nselected?"}
  PICK("Pick candidate\n(balance milestone/award counts)")
  REJECT{"Reject by\npair synergy?"}
  CHECK_TOTAL_SYN{"Total synergy\n> max?"}

  PARAMS --> LOAD_SIN --> INIT_RESULTS --> LEN_CHECK
  LEN_CHECK -- No --> PICK --> REJECT
  REJECT -- Yes --> PICK
  REJECT -- No --> LEN_CHECK
  LEN_CHECK -- Yes --> CHECK_TOTAL_SYN
  CHECK_TOTAL_SYN -- Yes --> INIT_RESULTS
  CHECK_TOTAL_SYN -- No --> DONE((Done))
```

---

# About

Built with React, Zustand, and bare CSS.
