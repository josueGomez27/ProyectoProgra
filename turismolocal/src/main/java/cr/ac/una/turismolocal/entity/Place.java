    package cr.ac.una.turismolocal.entity;

    import jakarta.persistence.*;
    import lombok.*;

    import java.math.BigDecimal;
    import java.time.LocalDateTime;
    import java.util.List;

    @Entity
    @Table(name = "places")
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public class Place {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne
        @JoinColumn(name = "town_id")
        private Town town;

        @ManyToOne
        @JoinColumn(name = "category_id")
        private Category category;

        private String name;

        @Column(columnDefinition = "TEXT")
        private String description;

        private String address;

        @Column(columnDefinition = "TEXT")
        private String imageUrl;

        private BigDecimal latitude;

        private BigDecimal longitude;

        private Boolean active;

        private LocalDateTime createdAt;

        private LocalDateTime updatedAt;

        @OneToMany(mappedBy = "place")
        private List<PlaceImage> images;
    }